type Props = {
  Quote: string;
  Author: string;
  Post: string;
};

const RightAuthWrapper = ({ Quote, Author, Post }: Props) => {
  return (
    <div className='flex flex-col w-screen h-screen justify-center items-center bg-slate-200/30'>
      <div className='text-3xl font-semibold'>"{Quote}"</div>
      <div className='text-xl text-gray-800'>-{Author}</div>
      <div className='text-xl text-gray-500'>{Post}</div>
    </div>
  );
};

export default RightAuthWrapper;
