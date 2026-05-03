// app/creators/page.tsx
export default function CreatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold mb-10">Our Creators</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="bg-zinc-900 rounded-3xl p-6 text-center">
          <div className="w-24 h-24 bg-zinc-700 rounded-full mx-auto mb-4" />
          <h3 className="font-medium">Luna</h3>
          <p className="text-rose-400 text-sm">12 items</p>
        </div>
      </div>
    </div>
  );
}
