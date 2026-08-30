---
'pca': minor
---

Anonymization of the compiled scripts, on by default and switchable off in the compilation settings. The compiler writes the path of the source script, the user name and the computer name in the pex header, all three readable by anyone who opens the file: PCA now replaces them with random strings of the very same lengths once the compilation succeeded. Nothing else is touched, the compilation time and every byte of the compiled code included, and the pex keeps its size. Skyrim, Fallout 4 and Starfield alike, and whichever compiler PCA is pointed at.

An existing configuration is upgraded with the anonymization on, as a new one is. When it fails, the compilation stays a success, the script is compiled after all, and the reason is raised in its log.
