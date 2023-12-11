#!/usr/bin/env bash

set -x

_root() {
  local CMDLINE
  local IFS=$'\n'
  CMDLINE=(--shell-type bash --shell-completion-index $COMP_CWORD)

  INDEX=0
  for arg in ${COMP_WORDS[@]}; do
    export COMP_WORD_$INDEX=${arg}
    (( INDEX++ ))
  done

  COMPREPLY=( $(/usr/local/bin/example "${CMDLINE[@]}") )

  # Unset the environment variables.
  unset $(compgen -v | grep "^COMP_WORD_")
}
complete -F _root root
