export const cn = (...classes: (string | false | null | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
  };
  
  export default cn;
  // utils/quoteUtil.ts

type Quote = {
    text: string;
    author: string;
  };
  
  const quotes: Quote[] = [
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
    {
      text: "If life were predictable it would cease to be life, and be without flavor.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
      author: "Oprah Winfrey",
    },
    {
      text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
      author: "James Cameron",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
  ];
  
  export const getRandomQuote = (): Quote => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };
  