import React from 'react';
import TreeNode from './TreeNode';

const ResponseField = ({ response }) => {
  return (
    <>
      <h2 className="font-bold text-xl font-sans mb-4 mt-10 text-left">Files in Repository:</h2>
      <div className="w-4/5 mx-auto mt-8 overflow-y-auto text-left">
        {Object.keys(response).map((key) => (
          <TreeNode key={key} data={response[key]} />
        ))}
      </div>
    </>
  );
};

export default ResponseField;
