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

				Snippet memory newSnippet = Snippet({
						text: _text,
						timestamp: block.timestamp,
						contributor: _contributor,
						rating: _rating,
						wordCount: _wordCount
				});

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

    // Function to return the entire array of snippets
    function getAllSnippets() public view returns (Snippet[] memory) {

        return snippets;

    }

    // Function to return the global word count and dataset rating
    function getGlobalStats() public view returns (int, int) {

        return (totalWordCount, datasetRating);

    }
}
