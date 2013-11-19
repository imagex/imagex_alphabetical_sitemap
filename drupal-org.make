api = 2
core = 7.x

; Download contributed modules.

projects[fuzzysearch][type] = "module"
projects[fuzzysearch][subdir] = "contrib"
projects[fuzzysearch][version] = "1.x-dev"
projects[history_js][type] = "module"
projects[history_js][subdir] = "contrib"
projects[history_js][version] = "1.0"
projects[history_js][patch][] = "https://raw.github.com/imagex/imagex_patches/7.x/contrib/history_js/history_js-new_repo-1964460-1.patch"
projects[search_api][type] = "module"
projects[search_api][subdir] = "contrib"
projects[search_api][version] = "1.4"
projects[search_api_db][type] = "module"
projects[search_api_db][subdir] = "contrib"
projects[search_api_db][version] = "1.0-beta4"


; Download Libraries.

libraries[history.js][download][type] = "file"
libraries[history.js][download][url] = "https://github.com/browserstate/history.js/archive/master.zip"
libraries[history.js][directory_name] = "history.js"
libraries[spinjs][download][type] = "file"
libraries[spinjs][download][url] = "http://fgnass.github.io/spin.js/dist/spin.min.js"
libraries[spinjs][directory_name] = "spinjs"
