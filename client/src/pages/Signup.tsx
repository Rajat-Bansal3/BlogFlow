import SignupWrapper from "../components/SignupWrapper.tsx";
import RightAuthWrapper from "../components/RightAuthWrapper.tsx";
import { getRandomQuote } from "../utils.ts";
type Props = {};

const Signup = (props: Props) => {
  const quote = getRandomQuote()
  return (
    <div className='flex'>
      <SignupWrapper className='flex  w-[70%] justify-center items-center h-screen flex-col gap-5' />
      <RightAuthWrapper Quote={quote.text} Author={quote.author} />
    </div>
  );
};

export default Signup;
