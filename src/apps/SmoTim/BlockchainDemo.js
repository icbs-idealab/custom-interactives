import React, { useState } from 'react';

const BlockchainDemo = () => {
  //
  // 1. "Calculate hash" => 12 characters total:
  //    - First 4 are "0000"
  //    - Next 8 come from the numeric bit-shift approach (padded to length 8).
  //
  const calculateHash = (block) => {
    const stringToHash = `${block.id}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`;
    let hashNum = 0;
    for (let i = 0; i < stringToHash.length; i++) {
      const char = stringToHash.charCodeAt(i);
      hashNum = ((hashNum << 5) - hashNum) + char;
      hashNum = hashNum & hashNum; // force 32-bit integer
    }
    // Convert that integer to positive hex
    const rawHex = Math.abs(hashNum).toString(16);
    // Pad it to 8 characters
    const paddedHex = rawHex.padStart(8, '0');
    // Prepend "0000" => total of 12 characters
    return '0000' + paddedHex; // e.g. "00009a7dc3f0"
  };

  //
  // 2. "Mine" => brute-force so the final char is '0'
  //    (a toy proof-of-work check)
  //
  const mineBlock = (block) => {
    let nonce = 0;
    let hash = calculateHash({ ...block, nonce });

    while (hash.slice(-1) !== '0' && nonce < 50000) {
      nonce++;
      hash = calculateHash({ ...block, nonce });
    }
    return { nonce, hash };
  };

  //
  // 3. Create 5 blocks. Genesis gets a 12-char hash of all zeros.
  //
  const createInitialChain = () => {
    const chain = [];

    // Genesis block
    const genesis = {
      id: 1,
      timestamp: Date.now(),
      data: "Genesis block",
      previousHash: "0",
      nonce: 0,
      isValid: true
    };
    const minedGenesis = mineBlock(genesis);
    genesis.nonce = minedGenesis.nonce;
    // Force the genesis block to have 12 zeros:
    genesis.hash = "000000000000"; // exactly 12 zeros
    genesis.originalData = genesis.data;
    genesis.originalHash = genesis.hash;
    chain.push(genesis);

    // Next 4 blocks
    for (let i = 2; i <= 5; i++) {
      const newBlock = {
        id: i,
        timestamp: Date.now(),
        data: `Block #${i} data`,
        previousHash: chain[chain.length - 1].hash,
        nonce: 0,
        isValid: true
      };
      const mined = mineBlock(newBlock);
      newBlock.nonce = mined.nonce;
      newBlock.hash = mined.hash;
      newBlock.originalData = newBlock.data;
      newBlock.originalHash = newBlock.hash;
      chain.push(newBlock);
    }

    return chain;
  };

  // Store our 5-block chain in React state
  const [blocks, setBlocks] = useState(createInitialChain());

  //
  // 4. Tamper logic: if data is changed, recalc. If restored, revert to original.
  //    Then re-check validity from block #0 forward.
  //
  const tamperBlock = (index, newData) => {
    const newBlocks = [...blocks];
    const block = newBlocks[index];

    // Update the data
    block.data = newData;

    // If typed back original data, restore originalHash
    if (newData === block.originalData) {
      block.hash = block.originalHash;
    } else {
      // Recalc a new (toy) 12-char hex hash
      block.hash = calculateHash(block);
    }

    // Validate from block[0] onward
    for (let i = 0; i < newBlocks.length; i++) {
      if (i === 0) {
        // Genesis is valid if data hasn't changed
        newBlocks[i].isValid = (newBlocks[i].data === newBlocks[i].originalData);
      } else {
        const prev = newBlocks[i - 1];
        const curr = newBlocks[i];

        if (curr.data === curr.originalData) {
          curr.hash = curr.originalHash;
        } else {
          curr.hash = calculateHash(curr);
        }

        const linkValid = (curr.previousHash === prev.hash);
        const dataUnchanged = (curr.data === curr.originalData);
        curr.isValid = prev.isValid && dataUnchanged && linkValid;
      }
    }

    setBlocks(newBlocks);
  };

  //
  // 5. Render
  //
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-xl font-bold">Simplified blockchain demonstration</h1>
        </div>

        {/* If chain is compromised, show alert */}
        {blocks.some(b => !b.isValid) && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
            Blockchain integrity compromised! Some blocks have been tampered with.
          </div>
        )}

        {/* Display the 5 blocks */}
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div key={block.id} className="flex flex-col items-center">
              <div
                className={`w-full border-2 rounded-lg p-4 ${
                  block.isValid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Block #{block.id}</p>
                    <input
                      type="text"
                      value={block.data}
                      onChange={(e) => tamperBlock(idx, e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hash</p>
                    <p className="font-mono text-xs break-all">{block.hash}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Previous Hash</p>
                    <p className="font-mono text-xs break-all">
                      {block.previousHash}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nonce</p>
                    <p className="font-mono text-sm">{block.nonce}</p>
                  </div>
                </div>
              </div>
              {idx < blocks.length - 1 && (
                <div
                  className={`py-2 ${
                    block.isValid ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {/* chain arrow icon, if you like */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockchainDemo;
