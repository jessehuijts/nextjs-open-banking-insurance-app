const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className='font-raleway text-primary name_underline mt-8 text-center text-4xl font-bold max-sm:text-2xl'>
      {children}
    </h1>
  );
};

export default Header;
