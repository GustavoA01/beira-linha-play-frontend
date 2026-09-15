import { renderHook, act } from '@testing-library/react';
import { useConfirmCourseCode } from '../useConfirmCourseCode';

describe('useConfirmCourseCode', () => {
  it('confirms when the typed code matches', () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useConfirmCourseCode(true, 'ABC123'));

    act(() => {
      result.current.onCodeChange('abc123');
    });
    act(() => {
      result.current.confirmIfMatches(onConfirm);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe('');
  });

  it('keeps an error when the code does not match', () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useConfirmCourseCode(true, 'ABC123'));

    act(() => {
      result.current.onCodeChange('errado');
    });
    act(() => {
      result.current.confirmIfMatches(onConfirm);
    });

    expect(onConfirm).not.toHaveBeenCalled();
    expect(result.current.error).toBe('O código do curso não confere');
  });

  it('clears the field when the dialog closes', () => {
    const { result, rerender } = renderHook(
      ({ open }) => useConfirmCourseCode(open, 'ABC123'),
      { initialProps: { open: true } }
    );

    act(() => {
      result.current.onCodeChange('ABC123');
    });

    rerender({ open: false });

    expect(result.current.code).toBe('');
    expect(result.current.error).toBe('');
  });
});
