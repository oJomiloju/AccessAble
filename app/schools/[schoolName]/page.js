export default function SchoolPage({ params }) {
    const { schoolName } = params;
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">{decodeURIComponent(schoolName)}</h1>
        <p>Details about {decodeURIComponent(schoolName)} will go here.</p>
      </div>
    );
  } 