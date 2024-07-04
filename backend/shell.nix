let
  # We pin to a specific nixpkgs commit for reproducibility.
  # Last updated: 2024-04-29. Check for new commits at https://status.nixos.org.
  pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/cf8cc1201be8bc71b7cbbbdaf349b22f4f99c7ae.tar.gz") {};
in pkgs.mkShell {
  packages = [
    (pkgs.python310.withPackages (python-pkgs: [
      python-pkgs.flask
      python-pkgs.flask-restful
      python-pkgs.psycopg2
      python-pkgs.python-dotenv
      python-pkgs.levenshtein
    ]))
  ];
}
