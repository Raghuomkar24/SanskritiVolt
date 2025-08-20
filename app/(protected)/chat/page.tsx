import ChatbotUI from '@/components/Chatbot'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col h-screen bg-cover bg-center"
         style={{ backgroundImage: "url('/your-background.png')" }}>
      {/* Fixed Chat Container */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl">
        <div className="bg-yellow-200 rounded-2xl shadow-lg h-[400px] flex flex-col">
          
          {/* Heading */}
          <div className="px-4 py-2 bg-yellow-300 rounded-t-2xl text-center font-bold text-lg">
            Samvad
          </div>

          {/* Chat area with scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            <ChatbotUI />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
