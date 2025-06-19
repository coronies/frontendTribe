import '../styles/background-effects.css';

export function HomePage(){
    return(
        <div className="relative mesh-gradient min-h-screen overflow-hidden">
            {/* Firefly elements */}
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>


            <div className="flex flex-col items-center justify-center min-h-screen z-10 relative">
                <h1 className="text-5xl font-bold mb-4 text-blue-700 floating">Welcome to Tribe</h1>
                <p className="text-xl text-gray-700 mb-10 max-w-lg text-center">
                    Your community hub for collaboration and connection at your university.
                </p>
                <div className="flex space-x-6">
                    <a href="/explore" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg glowing">
                        Explore Clubs
                    </a>
                    <a href="/dashboard" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg glowing">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    )
}