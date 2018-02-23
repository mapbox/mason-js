var test = require('tape');
var link = require('../lib/symlink.js');
var fs = require('fs');
var path = require('path');
var request = require('request');
var rimraf = require('rimraf');
var fse = require('fs-extra');
var appDir = process.cwd();

global.appRoot = process.cwd();

test('setup', (assert) => {

  if (fs.existsSync(__dirname + '/fixtures/out/mason_packages/.link')) fse.removeSync(__dirname + '/fixtures/out/mason_packages/.link');
  
  fse.mkdirpSync(__dirname + '/fixtures/out/mason_packages/.link');
  assert.end();
});

test('[symlink] builds correct symlink paths', function(assert) {
  var symlinkPath = path.join(global.appRoot, 'test/fixtures/out/mason_packages/.link');

  var libraries = [{
      name: 'protozero',
      version: '1.5.1',
      headers: true,
      os: null,
      awsPath: 'headers/protozero/1.5.1.tar.gz',
      src: 'https://s3.amazonaws.com/mason-binaries/headers/protozero/1.5.1.tar.gz',
      dst: appDir + '/test/fixtures/headers/protozero/1.5.1'
    },
    {
      name: 'cairo',
      version: '1.14.8',
      headers: null,
      os: 'osx-x86_64',
      awsPath: 'osx-x86_64/cairo/1.14.8.tar.gz',
      src: 'https://s3.amazonaws.com/mason-binaries/osx-x86_64/cairo/1.14.8.tar.gz',
      dst: appDir + '/test/fixtures/osx-x86_64/cairo/1.14.8'
    }
  ]

  var expected = [
    [appDir + '/test/fixtures/headers/protozero/1.5.1',
      symlinkPath
    ],
    [appDir + '/test/fixtures/osx-x86_64/cairo/1.14.8',
      symlinkPath
    ]
  ];

  var result = link.buildLinkPaths(libraries, symlinkPath);
  assert.deepEqual(result, expected);
  assert.end();
});

test('[symlink] creates symlink', function(assert) {
  var symlinkPath = path.join(global.appRoot, 'test/fixtures/out/mason_packages/.link');

  var paths = [
    [appDir + '/test/fixtures/headers/protozero/1.5.1',
      symlinkPath
    ],
    [appDir + '/test/fixtures/osx-x86_64/cairo/1.14.8',
      symlinkPath
    ]
  ];

  var proto = path.join(appDir + '/test/fixtures/out', 'mason_packages/.link', 'include', 'protozero', 'byteswap.hpp');
  var cairo = path.join(appDir + '/test/fixtures/out', 'mason_packages/.link', 'include', 'cairo', 'cairo-ft.h');

  console.log('symlink path exists!', fs.existsSync(symlinkPath));

  link.symLink(paths, function(err, result) {
    console.log('symlink path exists now!', fs.existsSync(symlinkPath));

    // console.log('paths!', paths);
    // console.log('symlinkPath!!!', symlinkPath);
    // console.log('proto out', proto);
    // console.log('cairo out', cairo);
    if (err) console.log(err);
    assert.equal(result, true);
    assert.equal(fs.existsSync(proto), true);
    assert.equal(fs.existsSync(cairo), true);
    assert.end();
  });
});

test('[symlink] fails to create symlink - directory not found', function(assert) {
  var symlinkPath = path.join(global.appRoot, 'test/fixtures/out/mason_packages/.link');

  var paths = [
    [appDir + '/test/fixtures/headers/protozro/1.5.1',
      symlinkPath
    ],
    [appDir + '/test/fixtures/osx-x8_64/cairo/1.14.8',
      symlinkPath
    ]
  ];

  link.symLink(paths, function(err, result) {
    assert.equal(/ENOENT: no such file or directory/.test(err.message), true);
    assert.end();
  });
});

test('cleanup', (assert) => {
  rimraf(__dirname + '/fixtures/out', (err) => {
    assert.ifError(err);
    assert.end();
  });
});