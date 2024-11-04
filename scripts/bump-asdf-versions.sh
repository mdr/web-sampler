#!/bin/bash
set -euo pipefail

echo "🛠️ Updating versions of asdf tools"

temp_file=$(mktemp)

while read -r line; do
  tool=$(echo "$line" | awk '{print $1}')
  current_version=$(echo "$line" | awk '{print $2}')
  if [[ "$tool" == "nodejs" ]]; then
    echo "$line" >> "$temp_file"
    continue
  fi
  latest_version=$(asdf latest "$tool")
  if [[ "$latest_version" != "$current_version" ]]; then
    echo "✨ Updating $tool from version $current_version to $latest_version"
  fi
  
  echo "$line" | sed -E "s/^($tool) .*/\1 $latest_version/" >> "$temp_file"
done < .tool-versions

mv "$temp_file" .tool-versions
