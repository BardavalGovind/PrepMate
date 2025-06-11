import React from 'react';

const Faq = () => {
    const faqs = [
        {
          question: "What is PrepMate?",
          answer:
            "PrepMate is an AI-powered study platform that helps students create, manage, and organize their notes efficiently. It includes voice-to-text, text-to-speech, AI-assisted summarization, and document storage.",
        },
        {
          question: "How do I get started with PrepMate?",
          answer:
            "Sign up and log in to your account. Once logged in, you can upload study materials, create notes using text or voice input, and use AI assistance for summarization.",
        },
        {
          question: "Can I upload and manage my own documents?",
          answer:
            "Yes! You can upload, view, edit, and delete your documents. The uploaded files are securely stored and searchable.",
        },
        {
          question: "How does the AI assistant help in note-taking?",
          answer:
            "PrepMate's AI assistant, powered by Gemini AI, helps summarize notes, generate study guides, and suggest key points for better learning.",
        },
        {
          question: "Can I listen to my notes instead of reading them?",
          answer:
            "Yes! Click the 'Listen' button (green color), and your notes will be read aloud using the text-to-speech feature.",
        },
        {
          question: "How do I search for my notes and files?",
          answer:
            "Use the search bar to find files quickly. Notes are also sorted based on their creation date.",
        },
        {
          question: "What is the + icon in ViewNotes for?",
          answer:
            "The '+' (blue color) icon allows you to create new notes using text input or voice-to-text functionality.",
        },
        {
          question: "How do I access my profile and track my uploads?",
          answer:
            "Your profile page shows details about your uploaded documents and activity. You can manage your uploads from there.",
        },
      ];

  return (
    <div className="h-heightWithoutNavbar grid place-content-center">
        <h1 className="mb-6 text-3xl font-black text-center">Frequently Asked Questions</h1>
      <div className="mx-auto max-w-[1550px] px-5 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faqs.map((item, i) => (
            <div key={i} className="border-b pb-3">
              <h1 className="mb-2 text-lg font-medium sm:text-xl">{item.question}</h1>
              <p className="text-sm text-gray-700 sm:text-base">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;