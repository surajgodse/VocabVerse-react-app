import React, { useState } from 'react';

function Dictionary() {
  const [word, setWord] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWordData = async () => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const result = await response.json();
      if (response.ok) {
        setData(result[0]);
        setError(null);
      } else {
        setError(result.message);
        setData(null);
      }
    } catch (err) {
      setError('An error occurred while fetching the data.');
      setData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWordData();
  };

  return (
    <div className="Dictionary">
      <header className="Dictionary-header">
        <h1>VocabVerse</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <main>
        {error && <p className="error">{error}</p>}
        {data && (
          <div className="word-data">
            <h2>{data.word}</h2>
            {data.phonetics.length > 0 && (
              <div className="phonetics">
                <h3>Phonetics</h3>
                <div className="audio-buttons">
                  <div className="phonetic-row">
                    {data.phonetics.map((phonetic, index) => (
                      <p key={index}>{phonetic.text}</p>
                    ))}
                  </div>
                  <div className="audio-button-row">
                    {data.phonetics.map((phonetic, index) => (
                      phonetic.audio && (
                        <div key={index} className="audio-button">
                          <button onClick={() => new Audio(phonetic.audio).play()}>
                            Play Audio {index + 1}
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
            {data.meanings.length > 0 && (
              <div className="meanings">
                <div className="part-of-speech">
                  <strong>Part of Speech:</strong> {data.meanings.map(meaning => meaning.partOfSpeech).join(', ')}
                </div>
                {data.meanings.slice(0, 3).map((meaning, index) => (
                  <div key={index} className="meaning">
                    {meaning.definitions.slice(0, 1).map((definition, defIndex) => (
                      <div key={defIndex} className="definition">
                        <p><strong>Definition {index + 1}:</strong> {definition.definition}</p>
                        {definition.example && (
                          <p><strong>Example:</strong> {definition.example}</p>
                        )}
                        {definition.synonyms.length > 0 && (
                          <p><strong>Synonyms:</strong> {definition.synonyms.join(', ')}</p>
                        )}
                        {definition.antonyms.length > 0 && (
                          <p><strong>Antonyms:</strong> {definition.antonyms.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dictionary;