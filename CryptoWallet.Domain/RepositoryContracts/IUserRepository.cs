﻿using CryptoWallet.Domain.Entities;

namespace CryptoWallet.Domain.RepositoryContracts
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User> GetByEmailAsync(string email);
    }
}
