import { ErrorFormMessage } from './ErrorFormMessage';
import { Input } from './ui/input';
import { Label } from './ui/label';

type ConfirmCourseCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export const ConfirmCourseCodeInput = ({
  value,
  onChange,
  error,
  disabled,
}: ConfirmCourseCodeInputProps) => (
  <div>
    <Label htmlFor="codigo-curso">Código do curso</Label>
    <Input
      id="codigo-curso"
      autoFocus
      value={value}
      autoComplete="off"
      disabled={disabled}
      placeholder="Digite o código do curso"
      className="mt-1.5 placeholder:max-sm:text-sm"
      onChange={(event) => onChange(event.target.value)}
    />
    {error && <ErrorFormMessage message={error} />}
  </div>
);
