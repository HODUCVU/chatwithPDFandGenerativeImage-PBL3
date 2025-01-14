import { Message } from 'ai/react';
import React, { useRef, useEffect } from 'react';
import {marked} from 'marked';
import { Loader2 } from 'lucide-react';
type Props = {
    isLoading: boolean;
    messages: Message[];
};

// Function to format the message content using marked (Markdown)
const formatMessageContent = (content: string) => {
    return marked(content); // Convert Markdown to HTML
};

const MessageList = ({messages, isLoading}: Props) => { 
    // const messages = [
    //     { text: 'Hello! How can I help you today?', role: 'system' },
    //     { text: 'I need some information about your services.', role: 'user' },
    // ];
    if(isLoading) {
        return (<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loader2 className='w-6 h-6 animate-spin'/>
        </div>)
    }
    if (!messages) return <></>
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end pl-10' : 'justify-start pr-10'}`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs shadow-md ${
                                message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-black'
                            }`}
                        >
                            {/* Render formatted content using dangerouslySetInnerHTML */}
                            <div dangerouslySetInnerHTML={{
                                 __html: formatMessageContent(message.content) 
                                }} 
                            />

                        </div>
                    </div>
                ))}
                {/* This div helps to scroll to the bottom */}
                <div ref={messageEndRef} />
            </div>
        </div>
    );
};

export default MessageList;