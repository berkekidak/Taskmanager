#!/bin/bash
source .env

bk="$VITE_BACKEND_URL"

function get {
  curl "$bk/tasks"
}

function add {
  curl -X POST "$bk/tasks" -H "Content-Type: application/json" -d '{"id": 10, "title": "Task inserted from script", "done": false}'
}

function update {
  curl -X PATCH "$bk/tasks/10" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Task updated from script",
      "done": true
    }'
}

function delete {
  echo "run this one after add"
  curl -X DELETE "$bk/tasks/10"
}

"$test_opts"

while true; do
  clear
  test_opts=$(echo "get add update delete " | tr ' ' '\n/' | fzf)
  if [[ -z $test_opts || "$test_opts" == "q" ]]; then
    break
  fi

  "$test_opts"
  echo

  read -p "Press Enter to continue, or q to exit" test_opts
done
