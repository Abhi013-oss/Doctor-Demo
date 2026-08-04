import { ChatConsole } from "@/features/messages/ChatConsole";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages | Console",
  description: "Manage client messaging and threads",
};

export default function MessagesPage() {
  return <ChatConsole />;
}
