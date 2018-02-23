GENCCODE_ASSEMBLY_TYPE=-a gcc-darwin
SO=dylib
SOBJ=dylib
A=a
LIBPREFIX=lib
LIB_EXT_ORDER=.57.1.dylib
COMPILE=/usr/bin/clang -DU_ATTRIBUTE_DEPRECATED= -DU_CHARSET_IS_UTF8=1 -DU_STATIC_IMPLEMENTATION -DU_CHARSET_IS_UTF8=1 -DU_STATIC_IMPLEMENTATION -DU_USING_ICU_NAMESPACE=0 -DUNISTR_FROM_CHAR_EXPLICIT=explicit -DUCONFIG_NO_LEGACY_CONVERSION=1 -DUCONFIG_NO_FORMATTING -DUCONFIG_NO_TRANSLITERATION -DUCONFIG_NO_REGULAR_EXPRESSIONS -fvisibility=hidden   -DU_ENABLE_DYLOAD=0 -DU_HAVE_ATOMIC=1  -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk -arch x86_64 -mmacosx-version-min=10.8 -O3 -DNDEBUG -std=c99 -Wall -pedantic -Wshadow -Wpointer-arith -Wmissing-prototypes -Wwrite-strings   -fno-common -c
LIBFLAGS=-I/Users/travis/build/mapbox/mason/mason_packages/osx-x86_64/icu/57.1/include  -dynamic
GENLIB=/usr/bin/clang -dynamiclib -dynamic -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk -arch x86_64 -mmacosx-version-min=10.8 -O3 -DNDEBUG -std=c99 -Wall -pedantic -Wshadow -Wpointer-arith -Wmissing-prototypes -Wwrite-strings   -Wl,-search_paths_first -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk -arch x86_64 -mmacosx-version-min=10.8  
LDICUDTFLAGS=
LD_SONAME=-Wl,-compatibility_version -Wl,57 -Wl,-current_version -Wl,57.1 -install_name
RPATH_FLAGS=
BIR_LDFLAGS=
AR=ar
ARFLAGS=r -c
RANLIB=ranlib
INSTALL_CMD=/usr/local/bin/ginstall -c
