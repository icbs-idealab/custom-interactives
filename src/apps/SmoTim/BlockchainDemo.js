import React, { useState } from 'react';

//
// 1. "Mined" hash: 12 chars, starting with '0000'
//
function calculateMinedHash(block) {
  const str = `${block.id}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`;
  let hashNum = 0;
  for (let i = 0; i < str.length; i++) {
    hashNum = ((hashNum << 5) - hashNum) + str.charCodeAt(i);
    hashNum = hashNum & hashNum; // force 32-bit
  }
  const rawHex = Math.abs(hashNum).toString(16).padStart(8, '0');
  return '0000' + rawHex; // total length 12, definitely starts with "0000"
}

//
// 1b. "Untethered" hash: 12 chars, deterministic, never starts "0000".
//     STEP: Double-pass approach => final 12 chars => if leading "0000", rewrite.
//
function calculateUntetheredHash(block) {
  const baseStr = `${block.id}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`;

  // PASS 1: integer shift => 8-hex
  let hashNum1 = 0;
  for (let i = 0; i < baseStr.length; i++) {
    hashNum1 = ((hashNum1 << 5) - hashNum1) + baseStr.charCodeAt(i);
    hashNum1 = hashNum1 & hashNum1; 
  }
  const firstHex = Math.abs(hashNum1).toString(16).padStart(8, '0');

  // PASS 2: feed firstHex into the same shift logic => second 8-hex
  let hashNum2 = 0;
  for (let j = 0; j < firstHex.length; j++) {
    hashNum2 = ((hashNum2 << 5) - hashNum2) + firstHex.charCodeAt(j);
    hashNum2 = hashNum2 & hashNum2;
  }
  const secondHex = Math.abs(hashNum2).toString(16).padStart(8, '0');

  // COMBINE => 16 hex chars => slice(0,12)
  let finalHex = (firstHex + secondHex).slice(0, 12);

  // If it starts with "0000", replace that with "abcd" so it never looks mined.
  if (finalHex.startsWith('0000')) {
    finalHex = 'abcd' + finalHex.slice(4);
  }

  return finalHex;
}

//
// 2. "Mine" => repeated calls to calculateMinedHash until last char is '0'
//
function mineBlock(block) {
  let nonce = 0;
  let hash = calculateMinedHash({ ...block, nonce });
  while (hash.slice(-1) !== '0' && nonce < 50000) {
    nonce++;
    hash = calculateMinedHash({ ...block, nonce });
  }
  return { nonce, hash };
}

//
// 3. Create initial chain of 5 blocks
//
function createInitialChain() {
  const chain = [];

  // Genesis
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
  // Force a 12-char zero hash
  genesis.hash = "000000000000";
  genesis.originalData = genesis.data;
  genesis.originalHash = genesis.hash;
  genesis.originalPreviousHash = genesis.previousHash;
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
    newBlock.originalPreviousHash = newBlock.previousHash;
    chain.push(newBlock);
  }

  return chain;
}

export default function BlockchainDemo() {
  // 4. State: current "blocks" plus a permanent "originalChain"
  const [blocks, setBlocks] = useState(createInitialChain());
  const [originalChain] = useState(createInitialChain);

  //
  // 5. Tamper logic
  //
  const tamperBlock = (index, newData) => {
    const newBlocks = [...blocks];
    newBlocks[index].data = newData;

    // We recalc from "index" forward
    for (let i = index; i < newBlocks.length; i++) {
      const block = newBlocks[i];
      // If not the genesis block, update its previousHash from the block before it
      if (i > 0) {
        block.previousHash = newBlocks[i - 1].hash;
      }

      // Decide if block is still "original" or "untethered"
      const dataIsOriginal = (block.data === block.originalData);
      const linkIsOriginal = (block.previousHash === block.originalPreviousHash);

      if (dataIsOriginal && linkIsOriginal) {
        // fully original => keep the original "mined" hash
        block.hash = block.originalHash;
      } else {
        // otherwise => "untethered" (double-pass approach)
        block.hash = calculateUntetheredHash(block);
      }
    }

    // 6. Re-check validity
    newBlocks[0].isValid = (newBlocks[0].data === newBlocks[0].originalData);
    for (let i = 1; i < newBlocks.length; i++) {
      const prev = newBlocks[i - 1];
      const curr = newBlocks[i];
      const dataUnchanged = (curr.data === curr.originalData);
      const linkUnchanged = (curr.previousHash === curr.originalPreviousHash);
      curr.isValid = prev.isValid && dataUnchanged && linkUnchanged;
    }

    setBlocks(newBlocks);
  };

  //
  // 7. Render Full-Size Chain (top section)
  //
  const renderChainFull = (chain, canEdit) => (
    <div className="space-y-4">
      {chain.map((block, idx) => (
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
                {canEdit ? (
                  <input
                    type="text"
                    value={block.data}
                    onChange={(e) => tamperBlock(idx, e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                ) : (
                  <p className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50">
                    {block.data}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Hash</p>
                <p className="font-mono text-xs break-all">{block.hash}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Previous hash</p>
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
          {idx < chain.length - 1 && (
            <div
              className={`py-2 ${
                block.isValid ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {/* chain arrow or line */}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  //
  // 8. Render "mini" chain: horizontally in small squares
  //
  const renderChainMini = (chain) => (
    <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-4">
      {chain.map((block, idx) => {
        const blockColor = block.isValid
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200';
        return (
          <React.Fragment key={block.id}>
            <div
              className={`
                flex flex-col p-2 border-2 rounded text-xs 
                break-all w-full md:w-40
                ${blockColor}
              `}
            >
              <div className="font-bold mb-1">Block #{block.id}</div>
              <p className="mb-1">Nonce: {block.nonce}</p>
              <p className="mb-1">Data: {block.data}</p>
              <p className="mb-1">Hash: {block.hash}</p>
              <p>Prev: {block.previousHash}</p>
            </div>
            {idx < chain.length - 1 && (
              <div className="hidden md:flex items-center text-gray-500 text-xl">
                &#8594; {/* arrow */}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  //
  // 9. Render Page
  //
  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-xl font-bold mb-2">Blockchain demonstration</h1>
        <p>
          Try amending some of the data in the blocks below and observe 
          the impact of your changes.
        </p>

        {blocks.some(b => !b.isValid) && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded mt-4">
            Blockchain integrity compromised! Some blocks have been tampered with.
          </div>
        )}

        <div className="mt-6">
          {renderChainFull(blocks, true)}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Comparison with other nodes</h2>
        <p className="mb-4">Compare your altered node chain with other nodes.</p>

        {/* Node #1: Reflects the current state */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-2">Node #1 (current/tampered)</h3>
          {renderChainMini(blocks)}
        </div>

        {/* Node #2: Original chain => read-only */}
        <div className="mb-6">
          <h3 className="text-md font-bold mb-2">Node #2 (original)</h3>
          {renderChainMini(originalChain)}
        </div>

        {/* Node #3: Original chain => read-only */}
        <div>
          <h3 className="text-md font-bold mb-2">Node #3 (original)</h3>
          {renderChainMini(originalChain)}
        </div>
      </div>
    </div>
  );
}
