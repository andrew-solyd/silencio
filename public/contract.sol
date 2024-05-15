// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SilencioSnippetStorage {
    // Define a struct to hold each snippet along with timestamp, contributor, rating, and word count
    struct Snippet {
				string text;
				uint256 timestamp;
				string contributor;
				int rating; 
				int wordCount;
    }

    // Array to store the snippets
    Snippet[] public snippets;

    // Global variables for total word count and average rating
    int public totalWordCount = 0;
    int public datasetRating = 0;

    // Function to add a snippet to the array
    function addSnippet(string memory _text, string memory _contributor, int _rating, int _wordCount) public {

				Snippet memory newSnippet;

				newSnippet.text = _text;
				newSnippet.timestamp = block.timestamp;
				newSnippet.contributor= _contributor;
				newSnippet.rating = _rating;
				newSnippet.wordCount = _wordCount;

				snippets.push(newSnippet);
			
				// Update total word count
				totalWordCount += _wordCount;

				// Update dataset rating using a weighted average
				if (totalWordCount > _wordCount) { // Check to prevent division by zero on the first entry
						datasetRating = (datasetRating * int(totalWordCount - _wordCount) + _rating * int(_wordCount)) / int(totalWordCount);
				} else {
						datasetRating = _rating; // For the first snippet, the dataset rating is simply its rating
				}

    }

     function getSnippetCount() public view returns (uint) {
        return snippets.length;
    }

    function getSnippet(uint index) public view returns (string memory, uint256, string memory, int, int) {
        require(index < snippets.length, "Index out of bounds");
        Snippet memory s = snippets[index];
        return (s.text, s.timestamp, s.contributor, s.rating, s.wordCount);
    }

    // Function to return the global word count and dataset rating
    function getGlobalStats() public view returns (int, int) {

        return (totalWordCount, datasetRating);

    }
}
