import _ "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import _ "mo:base/Nat";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor backend{

  type User = {
    username: Text;
    passwordHash: Text; // You can replace with actual hashing later
  };

  let users = HashMap.HashMap<Text, Text>(10, Text.equal, Text.hash); // username → passwordHash

    public func register(username: Text, password: Text) : async Text {
      if (users.get(username) != null) {
        Debug.print("Signup failed: " # username # " already exists.");
        return "Username already exists.";
      };
      users.put(username, password); // password is already hashed
        Debug.print("New user signed up: " # username);
      return "User registered successfully!";
    };

    public func login(username: Text, password: Text) : async Text {
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
