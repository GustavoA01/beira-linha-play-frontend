import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaDevice } from '@/hooks/useMediaDevice';
import { MessageCircle } from 'lucide-react';
import { Chat } from './Chat';

export const ChatDrawer = () => {
  const { isDesktop } = useMediaDevice();

  return (
    <Drawer direction="right" repositionInputs={false}>
      <DrawerTrigger
        className={
          isDesktop
            ? 'sm:py-2 px-2 rounded-md text-md font-montserrat hover:bg-primary-dark transition-all ease-in'
            : 'fixed bottom-10 right-5 p-4 rounded-full bg-primary shadow-lg z-50'
        }
      >
        <MessageCircle className="text-zinc-300" size={18} />
      </DrawerTrigger>
      <DrawerContent className="max-sm:inset-0 max-sm:h-auto max-sm:w-full! max-sm:max-w-none!">
        <Chat />
      </DrawerContent>
    </Drawer>
  );
};
