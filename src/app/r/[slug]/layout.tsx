const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        {/* TODO : A Button which takes us back to feed  */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>

          {/* info sidebar */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-400 order-first md:order-last">
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
