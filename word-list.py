# Script to generate word list files
words_by_length = {
    4: [], 5: [], 6: [], 7: [], 8: []
}

with open("/usr/share/dict/words") as f:
    for word in f:
        word = word.strip().lower()
        if word.isalpha() and 4 <= len(word) <= 8:
            words_by_length[len(word)].append(word)

# Write each list to a separate file
for length, words in words_by_length.items():
    with open(f"public/word-lists/words-{length}.txt", "w") as f:
        f.write("\n".join(words))
