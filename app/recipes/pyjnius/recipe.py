from pythonforandroid.recipe import CythonRecipe

class PyJNIusRecipe(CythonRecipe):
    version = "1.5.0"
    url = "https://github.com/kivy/pyjnius/archive/refs/tags/1.5.0.zip"
    call_hostpython_via_targetpython = False
    cythonize = True

    def cythonize_build(self, arch):
        import os
        env = self.get_recipe_env(arch)
        env["CFLAGS"] = env.get("CFLAGS", "") + " -Wno-error=implicit-function-declaration"
        super().cythonize_build(arch)

recipe = PyJNIusRecipe()

