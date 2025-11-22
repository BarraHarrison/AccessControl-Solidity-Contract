// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract AccessControlSecurity is AccessControl, Pausable {
    // -----------------------------
    // Role Definitions
    // -----------------------------
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant FREEZER_ROLE = keccak256("FREEZER_ROLE");
    bytes32 public constant BLACKLISTER_ROLE = keccak256("BLACKLISTER_ROLE");

    // -----------------------------
    // Storage
    // -----------------------------
    mapping(address => bool) private _frozen;
    mapping(address => bool) private _blacklisted;
    mapping(address => string) private _messages;

    // -----------------------------
    // Events
    // -----------------------------
    event AccountFrozen(address indexed account, address indexed by);
    event AccountUnfrozen(address indexed account, address indexed by);

    event AccountBlacklisted(address indexed account, address indexed by);
    event AccountRemovedFromBlacklist(address indexed account, address indexed by);

    event MessageSubmitted(address indexed from, string message);

    // -----------------------------
    // Constructor
    // -----------------------------
    constructor() {
        // Give deployer all initial roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(FREEZER_ROLE, msg.sender);
        _grantRole(BLACKLISTER_ROLE, msg.sender);
    }

    // -----------------------------
    // Modifiers
    // -----------------------------
    modifier notFrozen(address account) {
        require(!_frozen[account], "AccessControlSecurity: account is frozen");
        _;
    }

    modifier notBlacklisted(address account) {
        require(!_blacklisted[account], "AccessControlSecurity: account is blacklisted");
        _;
    }

    modifier onlyActive(address account) {
        require(!_blacklisted[account], "AccessControlSecurity: blacklisted");
        require(!_frozen[account], "AccessControlSecurity: frozen");
        _;
    }

    // -----------------------------
    // Pause / Unpause System (Pauser Role)
    // -----------------------------
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // -----------------------------
    // Freezing System (Freezer Role)
    // -----------------------------
    function freezeAccount(address account) external onlyRole(FREEZER_ROLE) {
        require(!_frozen[account], "Account already frozen");
        _frozen[account] = true;
        emit AccountFrozen(account, msg.sender);
    }

    function unfreezeAccount(address account) external onlyRole(FREEZER_ROLE) {
        require(_frozen[account], "Account is not frozen");
        _frozen[account] = false;
        emit AccountUnfrozen(account, msg.sender);
    }

    function isFrozen(address account) external view returns (bool) {
        return _frozen[account];
    }

    // -----------------------------
    // Blacklist System (Blacklister Role)
    // -----------------------------
    function blacklist(address account) external onlyRole(BLACKLISTER_ROLE) {
        require(!_blacklisted[account], "Already blacklisted");
        _blacklisted[account] = true;
        emit AccountBlacklisted(account, msg.sender);
    }

    function removeFromBlacklist(address account) external onlyRole(BLACKLISTER_ROLE) {
        require(_blacklisted[account], "Not blacklisted");
        _blacklisted[account] = false;
        emit AccountRemovedFromBlacklist(account, msg.sender);
    }

    function isBlacklisted(address account) external view returns (bool) {
        return _blacklisted[account];
    }

    // -----------------------------
    // User Action (restricted)
    // -----------------------------
    function submitMessage(string calldata message)
        external
        whenNotPaused
        onlyActive(msg.sender)
    {
        _messages[msg.sender] = message;
        emit MessageSubmitted(msg.sender, message);
    }

    function getMessage(address account) external view returns (string memory) {
        return _messages[account];
    }
}
