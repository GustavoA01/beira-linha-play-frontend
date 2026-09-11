import { ChatContent } from '../components/ChatContent';
import { ChatForm } from '../components/ChatForm';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from '../components/ChatHeader';

export const Chat = () => {
  const {
    isLoading,
    messages,
    onSubmit,
    register,
    applyQuestion,
    applyAllQuestions,
    isQuestionApplied,
    formFull,
    canSend,
    clearMessages,
    handleOnKeyDown,
  } = useChat();

  return (
    <div className="flex flex-col w-full h-full min-h-0 flex-1 pb-6">
      <ChatHeader onClear={clearMessages} messagesLength={messages.length} />
      <ChatContent
        messages={messages}
        isLoading={isLoading}
        formFull={formFull}
        isQuestionApplied={isQuestionApplied}
        onApplyQuestion={applyQuestion}
        onApplyAllQuestions={applyAllQuestions}
      />
      <ChatForm
        onSubmit={onSubmit}
        register={register}
        isLoading={isLoading}
        canSend={canSend}
        handleOnKeyDown={handleOnKeyDown}
      />
    </div>
  );
};
