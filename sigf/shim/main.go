// mr-launch.exe: SIGF launch shim for Minecraft-Ring (siddoff/Minecraft-Ring, MIT). Upstream's dinput8.dll proxy only
// loads its bridge when ERBRIDGE=1 is set in the game's environment (bridge-base/elden-ring/er-bridge/src/proxy.cpp),
// and the SIGF recipe format has no env field. This starts eldenring.exe, next to this exe, with ERBRIDGE=1 added to
// the inherited environment, and exits. It starts the game directly (not start_protected_game.exe): Easy Anti-Cheat
// stays off, offline play only, as upstream's Launch.ps1 does. It never sets ERMC_DIR.
// Build: GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -buildvcs=false -ldflags "-s -w -H windowsgui"
// SPDX-License-Identifier: MIT (SIGF)
package main

import (
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	self, err := os.Executable()
	if err != nil {
		os.Exit(1)
	}
	dir := filepath.Dir(self)
	cmd := exec.Command(filepath.Join(dir, "eldenring.exe"), os.Args[1:]...)
	cmd.Dir = dir
	cmd.Env = append(os.Environ(), "ERBRIDGE=1")
	if err := cmd.Start(); err != nil {
		os.Exit(1)
	}
}
