// App.tsx
import { Fragment, Suspense, useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import "./App.css";

type Photo = {
  id: number;
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

// chemical structure identifiers
const structureList = [
  { title: "Aspirin", structure: "CC(=O)Oc1ccccc1C(=O)O" },
  { title: "Caffeine", structure: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C" },
  { title: "Water", structure: "O" },
  { title: "Ethanol", structure: "CCO" },
  { title: "Methane", structure: "C" },
  { title: "  ", structure: "OC[C@H]1OC(O)[C@@H](O)[C@H](O)[C@H]1O" },
  { title: "Acetic Acid", structure: "CC(=O)O" },
  { title: "Hydrochloric Acid", structure: "Cl" },
  { title: "Ammonia", structure: "N" },
  { title: "Carbon Dioxide", structure: "O=C=O" },
  { title: "Cyanide", structure: "C#N" },
  { title: "Benzene", structure: "c1ccccc1" },
  { title: "Propane", structure: "CCC" },
  { title: "Sulfuric Acid", structure: "OS(=O)(=O)O" },
  { title: "Formic Acid", structure: "OC=O" },
  { title: "Methanol", structure: "CO" },
  { title: "Butane", structure: "CCCC" },
  { title: "Acetone", structure: "CC(=O)C" },
  { title: "Ammonium Ion", structure: "[NH4]+" },
  { title: "Nitrous Oxide", structure: "N#O" },
  { title: "Nitric Acid", structure: "O=N(=O)O" },
  { title: "Phosphoric Acid", structure: "OP(=O)(O)O" },
  { title: "Sodium Chloride", structure: "[Na+].[Cl-]" },
  { title: "Copper Sulfate", structure: "CuSO4" },
  { title: "Hydrogen Peroxide", structure: "OO" },
  { title: "Methylamine", structure: "CN" },
  { title: "Ethylene", structure: "C=C" },
  { title: "Lactic Acid", structure: "CC(C(=O)O)O" },
  { title: "Boric Acid", structure: "OB(O)O" },
  { title: "Glycine", structure: "C(C(=O)O)N" },
  { title: "Adenine", structure: "C5H5N5" },
  { title: "Carbon Monoxide", structure: "C#O" },
  { title: "Chloroform", structure: "CCl3" },
  { title: "Dimethyl Ether", structure: "COC" },
  { title: "Ethyl Acetate", structure: "CCOC(=O)C" },
  { title: "Fluorine", structure: "F" },
  { title: "Glycerol", structure: "C(C(CO)O)O" },
  { title: "Hydrazine", structure: "NN" },
  { title: "Iodine", structure: "I2" },
  { title: "Lithium Ion", structure: "[Li+]" },
  { title: "Manganese Dioxide", structure: "O=[Mn]=O" },
  { title: "Ozone", structure: "O=[O]=O" },
  { title: "Phenol", structure: "c1ccc(cc1)O" },
  {
    title: "Sucrose",
    structure: "O(C(C(C1C(C(C(C(O1)(CO)O)(CO)O)(C(=O)O)CO)O)O)CO)C",
  },
  { title: "Toluene", structure: "Cc1ccccc1" },
  { title: "Urea", structure: "NC(=O)N" },
  { title: "Xenon", structure: "Xe" },
  { title: "Yttrium", structure: "[Y]" },
  { title: "Zinc Ion", structure: "[Zn++]" },
  // Add more items as needed
];

const api = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
});

const PhotoComp: React.FC<{ photo: Photo }> = ({ photo }) => {
  const { user, urls } = photo;

  return (
    <Fragment>
      <img className="img" src={urls.regular} alt={user.name} />
      <a
        className="credit"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://unsplash.com/@${user.username}`}
      >
        {user.name}
      </a>
    </Fragment>
  );
};

function App() {
  const [data, setPhotosResponse] = useState<any>(null);
  const [ImgUrl, setImgUrl] = useState<any>(null);
  const [query, setQuery] = useState<string>("show");
  const [mode, setMode] = useState<string>("unsplash");
  useEffect(() => {
    // Make sure the query is not empty before making the API call

    const debounceTimeout = setTimeout(() => {
      if (query.trim() !== "") {
        if (mode === "unsplash") {
          api.search
            .getPhotos({ query, orientation: "landscape" })
            .then((result) => {
              setPhotosResponse(result);
            })
            .catch(() => {
              console.log("something went wrong!");
            });
        } else {
          const index = structureList.findIndex((item) => item.title === query);
          setImgUrl(
            `https://cactus.nci.nih.gov/chemical/structure/${structureList[index].structure}/image`
          );
        }
      }
    }, 1000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [query]);

  const handleSearch = () => {
    // Trigger a search when the button is clicked
    // (useEffect will handle the API call)
    if (mode === "Chemistry") {
      setImgUrl(null);
    } else {
      setPhotosResponse(null); // Clear previous results
    }
    setQuery(query.trim()); // Trim the query to remove leading/trailing spaces
  };

  const handleMode = (mode: string) => {
    setMode(mode);
    setQuery("");
  };

  if (data === null) {
    return (
      <h2>
        <div>Loading...</div>
      </h2>
    );
  } else {
    return (
      <>
        <div className="flex space-x-4 mb-4 items-center justify-center">
          <button
            onClick={() => handleMode("unsplash")}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              mode === "unsplash" ? "bg-blue-600" : ""
            }`}
          >
            Unsplash - {import.meta.env.MODE}
          </button>

          <button
            onClick={() => handleMode("Chemistry")}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              mode === "Chemistry" ? "bg-blue-600" : ""
            }`}
          >
            Chemistry
          </button>
        </div>

        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Search for cats..."
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Search
          </button>
        </div>

        {mode === "unsplash" ? (
          <Suspense fallback={<h2>Loading...</h2>}>
            <div className="feed">
              <ul className="columnUl">
                {data.response.results.map((photo: Photo) => (
                  <li key={photo.id} className="li">
                    <PhotoComp photo={photo} />
                  </li>
                ))}
              </ul>
            </div>
          </Suspense>
        ) : (
          <Suspense fallback={<h2>Loading...</h2>}>
            <div className="feed">
              <img
                className="img"
                src={ImgUrl}
                alt={query}
                style={{ width: "400px", height: "400px", borderRadius: "8px" }}
              />
            </div>
          </Suspense>
        )}
      </>
    );
  }
}

export default App;
