-- Enable realtime for chat_history table
ALTER TABLE public.chat_history REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_history;