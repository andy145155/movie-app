#!/bin/bash
FILES=`git diff --staged --name-only --diff-filter=MACRT | grep -v -E "(node_modules|prototype|3rdparty)"`

VUEFILES=`echo "$FILES" | grep -E "*.vue$" | paste -sd ' ' -`
if [ ! -z "$VUEFILES" ]
then
  yarn run prettier --parser 'vue' --html-whitespace-sensitivity ignore --write $VUEFILES
fi

TSFILES=`echo "$FILES" | grep -E "*.ts$" | paste -sd ' ' -`
if [ ! -z "$TSFILES" ]
then
  yarn run prettier --parser 'typescript' --write $TSFILES
fi

# https://prettier.io/docs/en/options.html#parser
# Both the babylon and flow parsers support the same set of JavaScript features
# (including Flow type annotations). They might differ in some edge cases, so
# if you run into one of those you can try flow instead of babylon.
JSFILES=`echo "$FILES" | grep -E "*.js$" | paste -sd ' ' -`
if [ ! -z "$JSFILES" ]
then
  yarn run prettier --parser 'flow' --write $JSFILES
fi

SCSSFILES=`echo "$FILES" | grep -E "*.scss$" | paste -sd ' ' -`
if [ ! -z "$SCSSFILES" ]
then
  yarn run prettier --parser 'scss' --write $SCSSFILES
fi

CSSFILES=`echo "$FILES" | grep -E "*.css$" | paste -sd ' ' -`
if [ ! -z "$CSSFILES" ]
then
  yarn run prettier --parser 'css' --write $CSSFILES
fi

JSONFILES=`echo "$FILES" | grep -E "*.json$" | paste -sd ' ' -`
if [ ! -z "$JSONFILES" ]
then
  yarn run prettier --parser 'json' --write $JSONFILES
fi

YAMLFILES=`echo "$FILES" | grep -E "*.y(a)?ml$" | paste -sd ' ' -`
if [ ! -z "$YAMLFILES" ]
then
  yarn run prettier --parser 'yaml' --write $YAMLFILES
fi