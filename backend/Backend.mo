// backend/main.mo - Motoko Backend yang diupdate untuk Internet Identity
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import _Option "mo:base/Option";
import _Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
actor Backend {
    
    // Types
    public type User = {
        principal: Principal;
        username: Text;
        gameData: GameData;
        createdAt: Int;
        lastLogin: Int;
    };

    public type GameData = {
        level: Nat;
        experience: Nat;
        coins: Nat;
        achievements: [Text];
    };

    public type UserResult = Result.Result<User, Text>;
    public type CreateUserResult = Result.Result<User, Text>;

    // State - ganti dari username/password ke Principal-based
    private stable var usersEntries: [(Principal, User)] = [];
    private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private var usernames = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash); // untuk check duplicate username

    // Stable storage
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Principal, User>(usersEntries.vals(), usersEntries.size(), Principal.equal, Principal.hash);
        usersEntries := [];
        
        // Rebuild usernames map
        for (user in users.vals()) {
            usernames.put(user.username, user.principal);
        };
    };

    // Check if user exists (replace login function)
    public query({caller}) func getUserProfile(): async ?User {
        if (Principal.isAnonymous(caller)) {
            return null;
        };
        
        return users.get(caller);
    };

    // Check if username is available
    public query func isUsernameAvailable(username: Text): async Bool {
        if (Text.size(username) < 3 or Text.size(username) > 20) {
            return false;
        };
        
        switch(usernames.get(username)) {
            case (?_) { false }; // username taken
            case null { true };  // username available
        };
    };

    // Create user with username (replace register function)
    public func createUserProfile({caller:Principal}, username: Text): async CreateUserResult {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous caller not allowed");
        };

        // Check if user already exists
        switch(users.get(caller)) {
            case (?_) {
                return #err("User profile already exists");
            };
            case null {
                // Validate username
                if (Text.size(username) < 3 or Text.size(username) > 20) {
                    return #err("Username must be between 3-20 characters");
                };

                // Check if username is taken
                switch(usernames.get(username)) {
                    case (?_) {
                        return #err("Username already taken");
                    };
                    case null {
                        let newUser: User = {
                            principal = caller;
                            username = username;
                            gameData = {
                                level = 1;
                                experience = 0;
                                coins = 100; // starter coins
                                achievements = [];
                            };
                            createdAt = Time.now();
                            lastLogin = Time.now();
                        };

                        users.put(caller, newUser);
                        usernames.put(username, caller);
                        
                        Debug.print("New user created: " # username # " with principal: " # Principal.toText(caller));
                        #ok(newUser);
                    };
                };
            };
        };
    };

    // Update game data
    public func updateGameData({caller: Principal}, gameData: GameData): async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous caller not allowed");
        };

        switch(users.get(caller)) {
            case (?user) {
                let updatedUser: User = {
                    principal = user.principal;
                    username = user.username;
                    gameData = gameData;
                    createdAt = user.createdAt;
                    lastLogin = Time.now();
                };
                
                users.put(caller, updatedUser);
                #ok(());
            };
            case null {
                #err("User not found");
            };
        };
    };

    // Get game data
    public query({caller}) func getGameData(): async ?GameData {
        if (Principal.isAnonymous(caller)) {
            return null;
        };

        switch(users.get(caller)) {
            case (?user) { ?user.gameData };
            case null { null };
        };
    };

    // Add coins
    public func addCoins({caller: Principal}, amount: Nat): async Result.Result<Nat, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous caller not allowed");
        };

        switch(users.get(caller)) {
            case (?user) {
                let newCoins = user.gameData.coins + amount;
                
                let updatedGameData: GameData = {
                    level = user.gameData.level;
                    experience = user.gameData.experience;
                    coins = newCoins;
                    achievements = user.gameData.achievements;
                };

                let updatedUser: User = {
                    principal = user.principal;
                    username = user.username;
                    gameData = updatedGameData;
                    createdAt = user.createdAt;
                    lastLogin = Time.now();
                };
                
                users.put(caller, updatedUser);
                #ok(newCoins);
            };
            case null {
                #err("User not found");
            };
        };
    };


    // Stats
    public query func getTotalUsers(): async Nat {
        users.size();
    };

    public query func listUsers(): async [Text] {
        Iter.toArray(Iter.map(users.vals(), func(user: User): Text { user.username }));
    };

    // Health check
    public query func health(): async Text {
        "Backend updated for Internet Identity with " # Nat.toText(users.size()) # " users";
    };

}
