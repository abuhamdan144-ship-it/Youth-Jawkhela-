import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

old_catch = """    } catch (error) {
      console.error(error);
      alert('Failed to add cabinet member');
    }"""

new_catch = """    } catch (error: any) {
      console.error(error);
      alert(`Failed to save: ${error.message || 'Unknown error'}`);
    }"""

code = code.replace(old_catch, new_catch)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
