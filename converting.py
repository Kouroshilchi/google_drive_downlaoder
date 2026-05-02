import os

def combine_files_in_folder(folder_path, output_filename, file_pattern="model_part_*.bin"):
    # Get a list of files in the folder that match the specified pattern
    files_to_combine = [f for f in os.listdir(folder_path) if f.startswith("model_part_") and f.endswith(".bin")]

    # If no files are found, print a message and return
    if not files_to_combine:
        print(f"Pattern not found.")
        return

    # Sort the files to ensure they are combined in the correct order
    files_to_combine.sort()

    # Print the list of files that will be merged
    print(f"Files for merging: {files_to_combine}")

    # Open the output file in binary write mode
    with open(os.path.join(folder_path, output_filename), 'wb') as outfile:
        print(f"Merging started for '{output_filename}'...")
        
        # Iterate over each file to be combined
        for filename in files_to_combine:
            file_path = os.path.join(folder_path, filename)
            try:
                # Open each input file in binary read mode
                with open(file_path, 'rb') as infile:
                    # Define the chunk size for reading and writing
                    chunk_size = 1024 * 1024 * 50  # 50MB chunks
                    while True:
                        # Read a chunk from the input file
                        chunk = infile.read(chunk_size)
                        # If no more data, break the loop
                        if not chunk:
                            break
                        # Write the chunk to the output file
                        outfile.write(chunk)
                # Print a success message for each successfully merged file
                print(f"File: '{filename}' successfully merged.")
            except IOError as e:
                # Handle potential file I/O errors
                print(f"Error reading file '{filename}': {e}")
            except Exception as e:
                # Handle any other unexpected errors
                print(f"Unknown error with file '{filename}': {e}")
    
    # Print a success message indicating all files have been merged
    print(f"Files successfully merged into '{output_filename}'.")


# Example usage:
# Define the folder path where the model parts are located (replace with your actual path)
folder_path_example = ""  

# Define the name for the combined output file
output_filename_example = ""

# Call the function to combine the files
combine_files_in_folder(folder_path_example, output_filename_example)
