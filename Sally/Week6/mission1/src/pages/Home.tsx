import { Link } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";

const Home = () => {
  const { data, isLoading, isError } = useGetLpList({});

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">Error fetching data</div>
    );
  }

  const lps = data?.data.data;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps && lps.length > 0 ? (
          lps.map((lp) => (
            <div
              key={lp.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <Link to={`/lp/${lp.id}`}>
                <img
                  src={lp.thumbnail || "https://via.placeholder.com/150"}
                  alt={lp.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg">{lp.title}</h2>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">No LPs found.</div>
        )}
      </div>
    </div>
  );
};
export default Home;
