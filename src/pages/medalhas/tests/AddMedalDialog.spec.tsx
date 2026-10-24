import type { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddMedalDialog } from '../components/AddMedalDialog';
import { createMedal } from '@/services/medalhas';
import { toast } from '@/components/ui/toast';

jest.mock('@/services/medalhas', () => ({
  listMedals: jest.fn(),
  createMedal: jest.fn(),
  deleteMedal: jest.fn(),
  equipMedal: jest.fn(),
}));

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

const mockedCreateMedal = createMedal as jest.MockedFunction<
  typeof createMedal
>;
const mockedToastAdd = toast.add as jest.MockedFunction<typeof toast.add>;

const renderDialog = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('AddMedalDialog', () => {
  const file = new File(['medalha'], 'medalha.png', { type: 'image/png' });

  beforeEach(() => {
    mockedCreateMedal.mockReset();
    mockedToastAdd.mockReset();
  });

  it('shows the form when open', () => {
    renderDialog(<AddMedalDialog open onOpenChange={jest.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Adicionar medalha' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Pontos mínimos')).toBeInTheDocument();
    expect(screen.getByLabelText('Imagem')).toBeInTheDocument();
  });

  it('opens the file picker by clicking the area or using the keyboard', async () => {
    const user = userEvent.setup();
    renderDialog(<AddMedalDialog open onOpenChange={jest.fn()} />);
    const input = screen.getByLabelText('Imagem') as HTMLInputElement;
    const click = jest.spyOn(input, 'click').mockImplementation(() => {});
    const area = screen.getByRole('button', {
      name: 'Enviar imagem da medalha',
    });
    await user.click(area);
    expect(click).toHaveBeenCalledTimes(1);
    area.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(click).toHaveBeenCalledTimes(3);
    click.mockRestore();
  });

  it('does not render the content when closed', () => {
    renderDialog(<AddMedalDialog open={false} onOpenChange={jest.fn()} />);

    expect(
      screen.queryByRole('heading', { name: 'Adicionar medalha' })
    ).not.toBeInTheDocument();
  });

  it('validates required name and image', async () => {
    const user = userEvent.setup();

    renderDialog(<AddMedalDialog open onOpenChange={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(
      await screen.findByText('Informe o nome da medalha')
    ).toBeInTheDocument();
    expect(screen.getByText('Selecione uma imagem')).toBeInTheDocument();
    expect(mockedCreateMedal).not.toHaveBeenCalled();
  });

  it('clears the required image error after selecting an image', async () => {
    const user = userEvent.setup();
    renderDialog(<AddMedalDialog open onOpenChange={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));
    expect(await screen.findByText('Selecione uma imagem')).toBeInTheDocument();
    await user.upload(screen.getByLabelText('Imagem'), file);
    await screen.findByRole('img', { name: 'Prévia da medalha' });
    await waitFor(() => {
      expect(
        screen.queryByText('Selecione uma imagem')
      ).not.toBeInTheDocument();
    });
  });

  it('immediately shows the size error and clears it when a smaller image is selected', async () => {
    const user = userEvent.setup();
    renderDialog(<AddMedalDialog open onOpenChange={jest.fn()} />);
    const large = new File([new Uint8Array(3 * 1024 * 1024)], 'grande.png', {
      type: 'image/png',
    });
    await user.upload(screen.getByLabelText('Imagem'), large);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Esta imagem tem 3 MB e ultrapassa o limite de 2 MB'
    );
    expect(mockedCreateMedal).not.toHaveBeenCalled();
    expect(mockedToastAdd).not.toHaveBeenCalled();
    await user.upload(screen.getByLabelText('Imagem'), file);
    await waitFor(() =>
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    );
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it.each(['picker', 'drop'])(
    'creates the medal via %s sending the image to the API',
    async (mode) => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      mockedCreateMedal.mockResolvedValue({
        id: 'medal-1',
        nome: 'PUC Minas',
        imagemUrl:
          'https://res.cloudinary.com/nome-cloud-ficticio/image/upload/medalha.png',
        pontosMin: 0,
        conquistada: false,
      });

      renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'Adicionar' }));
      expect(
        await screen.findByText('Selecione uma imagem')
      ).toBeInTheDocument();
      await user.type(screen.getByLabelText('Nome'), 'PUC Minas');
      if (mode === 'drop') {
        const donor = document.createElement('input');
        donor.type = 'file';
        screen.getByRole('dialog').appendChild(donor);
        await user.upload(donor, file);
        const files = donor.files;
        donor.remove();
        fireEvent.drop(
          screen.getByRole('button', { name: 'Enviar imagem da medalha' }),
          { dataTransfer: { files } }
        );
        expect(
          await screen.findByText('Imagem selecionada: medalha.png')
        ).toBeInTheDocument();
      } else {
        await user.upload(screen.getByLabelText('Imagem'), file);
      }

      const preview = await screen.findByRole('img', {
        name: 'Prévia da medalha',
      });
      expect(preview).toHaveAttribute(
        'src',
        expect.stringContaining('data:image/png;base64,')
      );
      await user.click(screen.getByRole('button', { name: 'Adicionar' }));

      await waitFor(() => {
        expect(mockedCreateMedal).toHaveBeenCalledWith(
          {
            nome: 'PUC Minas',
            pontosMin: 0,
            imagem: file,
          },
          expect.anything()
        );
      });
      expect(mockedToastAdd).toHaveBeenCalledWith({
        type: 'success',
        title: 'Medalha adicionada',
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  );

  it('allows retrying after an API failure without reloading', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    mockedCreateMedal.mockRejectedValueOnce(new Error('Falha temporária'));
    mockedCreateMedal.mockResolvedValueOnce({
      id: 'medal-2',
      nome: 'Praça',
      imagemUrl: '/medalha.png',
      pontosMin: 90,
      conquistada: false,
    });
    renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);
    await user.type(screen.getByLabelText('Nome'), 'Praça');
    const points = screen.getByLabelText('Pontos mínimos');
    await user.clear(points);
    await user.type(points, '90');
    await user.upload(screen.getByLabelText('Imagem'), file);
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));
    await screen.findByText('Não foi possível enviar a imagem. Tente de novo.');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(mockedCreateMedal).toHaveBeenCalledTimes(2);
  });

  it('shows an error when the API rejects the image', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    mockedCreateMedal.mockRejectedValue(new Error('Falha ao enviar a imagem'));

    renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Nome'), 'PUC Minas');
    await user.upload(screen.getByLabelText('Imagem'), file);
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(
      await screen.findByText(
        'Não foi possível enviar a imagem. Tente de novo.'
      )
    ).toBeInTheDocument();
    expect(mockedToastAdd).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
