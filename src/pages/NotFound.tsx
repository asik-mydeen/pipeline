const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-bold font-mono text-foreground">404</h1>
      <p className="mb-4 text-xl text-muted-foreground">Page not found</p>
      <a href="/" className="text-primary underline">Return to Pipeline</a>
    </div>
  </div>
);

export default NotFound;
