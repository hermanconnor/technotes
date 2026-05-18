const Loading = () => {
  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Spinner UI */}
      <div className="relative size-16">
        <div className="border-primary/20 absolute inset-0 rounded-full border-4"></div>
        <div className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
      <h2 className="text-foreground mt-6 text-xl font-semibold tracking-wide">
        Loading...
      </h2>
    </div>
  );
};

export default Loading;
