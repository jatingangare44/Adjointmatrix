document.addEventListener('DOMContentLoaded', function () {
    const numRowsInput = document.getElementById('numRows');
    const numColsInput = document.getElementById('numCols');
    const generateMatrixButton = document.getElementById('generateMatrixButton');
    const matrixInputContainer = document.getElementById('matrixInputContainer');
    const matrixInput = document.getElementById('matrixInput');
    const calculateButton = document.getElementById('calculateButton');
    const result = document.getElementById('result');
    const clearButton = document.getElementById('clearButton');
    const downloadButton = document.getElementById('downloadButton');

    generateMatrixButton.addEventListener('click', function () {
        const numRows = parseInt(numRowsInput.value);
        const numCols = parseInt(numColsInput.value);

        if (isNaN(numRows) || isNaN(numCols) || numRows < 1 || numCols < 1) {
            alert('Please enter valid row and column numbers.');
            return;
        }

        // Show the matrix input textarea, the "Calculate Adjoint" button, and the "Clear" button
        matrixInputContainer.style.display = 'block';
        calculateButton.style.display = 'block';
        clearButton.style.display = 'block';

        // Generate an empty matrix input area
        matrixInput.value = generateEmptyMatrix(numRows, numCols);
    });

    clearButton.addEventListener('click', function () {
        // Clear the matrix input textarea and result
        matrixInput.value = '';
        result.innerHTML = '';
        // Hide the clear button
        clearButton.style.display = 'none';
    });

    calculateButton.addEventListener('click', function () {
        const inputText = matrixInput.value;
        const matrixRows = inputText.split('\n').map(row => row.split(',').map(Number));

        if (matrixRows.some(row => row.length !== matrixRows[0].length)) {
            result.innerHTML = '<p>Error: Matrix must be square (same number of rows and columns).</p>';
            return;
        }

        const adjointMatrix = calculateAdjoint(matrixRows);
        result.innerHTML = `<p>Adjoint Matrix:</p><pre>${matrixToString(adjointMatrix)}</pre>`;
        downloadButton.style.display = 'block'; // Show the download button
    });

    function generateEmptyMatrix(rows, cols) {
        const rowArray = new Array(cols).fill('0').join(', ');
        const matrixArray = new Array(rows).fill(rowArray);
        return matrixArray.join('\n');
    }

    function calculateCofactor(matrix, row, col) {
        // Helper function to calculate the cofactor of an element at row, col
        const subMatrix = matrix.map(row => row.slice()); // Create a copy of the matrix
        subMatrix.splice(row, 1); // Remove the row
        for (let i = 0; i < subMatrix.length; i++) {
            subMatrix[i].splice(col, 1); // Remove the column
        }
        const cofactor = determinant(subMatrix);
        return ((row + col) % 2 === 0 ? 1 : -1) * cofactor; // Apply the sign
    }

    function determinant(matrix) {
        // Recursive function to calculate the determinant of a matrix
        const n = matrix.length;
        if (n === 1) {
            return matrix[0][0];
        } else if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else {
            let det = 0;
            for (let i = 0; i < n; i++) {
                det += matrix[0][i] * calculateCofactor(matrix, 0, i);
            }
            return det;
        }
    }

    function calculateAdjoint(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error("Matrix must be square to find the adjoint.");
        }

        const adjoint = [];
        for (let i = 0; i < n; i++) {
            adjoint[i] = [];
            for (let j = 0; j < n; j++) {
                adjoint[i][j] = calculateCofactor(matrix, i, j);
            }
        }

        return adjoint;
    }

    function matrixToString(matrix) {
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        const transposedMatrix = [];

        for (let j = 0; j < numCols; j++) {
            const row = [];
            for (let i = 0; i < numRows; i++) {
                row.push(matrix[i][j]);
            }
            transposedMatrix.push(row);
        }

        return transposedMatrix.map(row => row.join(', ')).join('\n');
    }

    downloadButton.addEventListener('click', function () {
        // Get the user's input and result
        const numRows = numRowsInput.value;
        const numCols = numColsInput.value;
        const matrixInputText = matrixInput.value;
        const resultText = result.textContent;

        // Create a plain text string with the input and result
        const textData = `Number of Rows: ${numRows}\nNumber of Columns: ${numCols}\n\nMatrix Input:\n${matrixInputText}\n\nResult:\n${resultText}`;

        // Create a Blob with the text data
        const blob = new Blob([textData], { type: 'text/plain' });

        // Create a link to download the Blob
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'matrix_adjoint_results.txt'; // Change the file extension to .txt

        // Trigger the download
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
