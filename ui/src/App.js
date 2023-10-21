import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import ResponseField from "./ResponseField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { GITHUB_REPO_REGEX, FETCH_REPO_FILES_URL } from "./constants";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [error]);

  function createTree(data) {
    const tree = {};
  
    data.forEach((item) => {
      const pathSegments = item.path.split("/");
      let currentLevel = tree;
  
      pathSegments.forEach((segment, index) => {
        if (!currentLevel.children) {
          currentLevel.children = {};
        }
        
        if (!currentLevel.children[segment]) {
          currentLevel.children[segment] = index === pathSegments.length - 1 ? item : {};
        }
        
        currentLevel = currentLevel.children[segment];
      });
    });
  
    return tree;
  }

  const getRepoFiles = async (owner, repo) => {
    const response = await fetch(FETCH_REPO_FILES_URL.replace("${owner}", owner).replace("${repo}", repo));
    const data = await response.json();
    return data.tree;
  };
  
  const extractOwnerAndRepo = (link) => {
    const match = GITHUB_REPO_REGEX.exec(link);
    if (match) {
      const { groups: { owner, repo } } = match;
      return { owner, repo };
    }
    return null;
  };

  const isValidGithubLink = (link) => {
    return GITHUB_REPO_REGEX.test(link);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    if(isValidGithubLink(inputValue)){
      const repoInfo = extractOwnerAndRepo(inputValue);
      if(repoInfo){
        const { owner, repo } = repoInfo;
        getRepoFiles(owner, repo)
        .then((files) => {
          setError(null);
          const tree = createTree(files);
          setResponse(tree.children);
          setIsLoading(false);
          setInputValue("");
        })
        .catch((error) => {
          setError("Error : ",error);
          setIsLoading(false);
        });
      }
      else {
        setError("Could not extract owner and repository from the link");
        setResponse(null);
        setIsLoading(false);
      }
      setError(null);
      setIsLoading(false);
    }
    else {
      setError("Please enter a valid public GitHub repository URL");
      setResponse(null);
      setIsLoading(false);
    }

    // fetch("http://localhost:8000/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ input: inputValue }),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    //   setError(null);
    //   setResponse(data);
    //   setIsLoading(false);
    //   setInputValue("");
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    //   setError("Error : ",error);
    //   setIsLoading(false);
    // });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-[#232a37]">
      <div className="mt-8">
        <h1 className="w-full font-bold text-3xl font-sans text-center mb-4">
          Code Documentor
        </h1>
      </div>
      <h2 className="w-full font-bold text-xl font-sans mt-4 text-center text-[#354252]">
        Enter a GitHub link below to generate documentation:
      </h2>
      <div className="relative w-4/5 mx-auto mt-8">
        <input
          type="text"
          className="w-full h-12 p-4 rounded-lg border-2 border-[#232a37]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className={`absolute top-0 right-0 h-full px-4 font-bold rounded-r-lg ${
            inputValue
              ? "bg-[#232a37] text-white cursor-pointer"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={!inputValue || isLoading}
        >
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {error && <Notification error={error} />}
      {response && <ResponseField response={response} />}
    </div>
  );
}

export default App;
