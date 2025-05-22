import _ "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import _ "mo:base/Nat";
import Iter "mo:base/Iter";

actor backend{

  type User = {
    username: Text;
    passwordHash: Text; // You can replace with actual hashing later
  };

  let users = HashMap.HashMap<Text, Text>(10, Text.equal, Text.hash); // username → passwordHash

    public func signUp(username: Text, password: Text) : async Text {
      if (users.get(username) != null) {
        return "Username already exists.";
      };
      users.put(username, password); // password is already hashed
      return "User registered successfully!";
    };

    public func signIn(username: Text, password: Text) : async Text {
      switch (users.get(username)) {
        case null { return "User not found."; };
        case (?storedPassword) {
          if (storedPassword == password) { // already comparing hash
            return "Sign-in successful!";
          } else {
            return "Invalid password.";
          };
        };
      };
    };

  public query func listUsers() : async [Text] {
    Iter.toArray(users.keys());
  };
}
