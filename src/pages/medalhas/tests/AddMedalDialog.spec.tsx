import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddMedalDialog } from '../components/AddMedalDialog';
import { uploadImage } from '@/services/cloudinary';
import { createMedal } from '@/services/medalhas';
import { toast } from '@/components/ui/toast';

jest.mock('@/services/cloudinary', () => ({
  uploadImage: jest.fn(),
}));

jest.mock('@/services/medalhas', () => ({
  listMedals: jest.fn(),
  createMedal: jest.fn(),
  deleteMedal: jest.fn(),
  equipMedal: jest.fn(),
}));

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

const mockedUploadImage = uploadImage as jest.MockedFunction<
  typeof uploadImage
>;
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
    mockedUploadImage.mockReset();
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
    expect(mockedUploadImage).not.toHaveBeenCalled();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('creates the medal after uploading the image', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    mockedUploadImage.mockResolvedValue(
      'https://res.cloudinary.com/nome-cloud-ficticio/image/upload/medalha.png'
    );
    mockedCreateMedal.mockResolvedValue({
      id: 'medal-1',
      nome: 'PUC Minas',
      imagemUrl:
        'https://res.cloudinary.com/nome-cloud-ficticio/image/upload/medalha.png',
      pontosMin: 0,
      conquistada: false,
    });

    renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Nome'), 'PUC Minas');
    await user.upload(screen.getByLabelText('Imagem'), file);
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockedCreateMedal).toHaveBeenCalledWith(
        {
          nome: 'PUC Minas',
          pontosMin: 0,
          imagemUrl:
            'https://res.cloudinary.com/nome-cloud-ficticio/image/upload/medalha.png',
        },
        expect.anything()
      );
    });
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Medalha adicionada',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows an error when the image upload fails', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    mockedUploadImage.mockRejectedValue(new Error('Falha ao enviar a imagem'));

    renderDialog(<AddMedalDialog open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Nome'), 'PUC Minas');
    await user.upload(screen.getByLabelText('Imagem'), file);
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(
      await screen.findByText(
        'Não foi possível enviar a imagem. Tente de novo.'
      )
    ).toBeInTheDocument();
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'error',
      title: 'Não foi possível enviar a imagem.',
    });
    expect(mockedCreateMedal).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
