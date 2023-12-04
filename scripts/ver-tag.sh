#!/bin/bash
set -e

# exmaple:
# scripts/ver-tag.sh patch
# scripts/ver-tag.sh prelease pre

npm version --no-git-tag-version --preid "${2}" "${1}"
VERSION="$(jq < package.json -r .version)"

git add .
git commit --allow-empty -m "${VERSION}"
git tag "v${VERSION}" -am "${VERSION}"

echo "Operations for release:"
echo "- git push --follow-tags origin"
echo "- Create a release in any desired way"
echo "  (i.e. gh release create v${VERSION} -t ${VERSION} --target "'"$(git rev-parse --abbrev-ref HEAD)"'")"
