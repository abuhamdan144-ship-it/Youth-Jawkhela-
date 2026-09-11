import re

with open('src/lib/firebase.ts', 'r') as f:
    code = f.read()

# Replace getFirestore with enableIndexedDbPersistence
old_import = "import { getFirestore } from 'firebase/firestore';"
new_import = "import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';"

if "enableIndexedDbPersistence" not in code:
    code = code.replace(old_import, new_import)

old_init = "export const db = getFirestore(app);"
new_init = """export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});"""

if "enableIndexedDbPersistence(db)" not in code:
    code = code.replace(old_init, new_init)

with open('src/lib/firebase.ts', 'w') as f:
    f.write(code)
