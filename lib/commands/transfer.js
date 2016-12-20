'use strict';

const chalk = require('chalk');

const setupTransferCommand = (data, iotajs, vorpal) => {
  vorpal
    .command('transfer <address> <value>', 'Sends iotas to the address')
    .action((args, callback) => {
      if (!data.currentNodeInfo) {
        vorpal.log(chalk.red('It looks like you are not connected to an iota node.  Try "node".'));
        return callback();
      }

      if (!data.seed) {
        vorpal.log(chalk.red('Please set a seed first with the "seed" command.'));
        return callback();
      }

      if (Number.isNaN(args.value) || Math.floor(args.value) !== args.value) {
        vorpal.log(chalk.red('Please supply an integer for the value.'));
        return callback();
      }

      if (parseInt(args.value) === 0) {
        vorpal.log(chalk.red('The value cannot be zero.'));
        return callback();
      }

      if (args.address.length === 90 && !iotajs.utils.isValidChecksum(args.address)) {
        vorpal.log(chalk.red('That address appears malformed.  Please check it.'));
        return callback();
      }

      const address = args.address.length === 81
        ? iotajs.utils.addChecksum(args.address)
        : args.address;

      vorpal.log('One moment while the transfer is made.  This can take a few minutes.');
      const transfers = [{
        address,
        value: parseInt(args.value),
        message: '',
        tag: ''
      }];

      iotajs.api.sendTransfer(data.seed, data.depth, data.minWeightMagnitude, transfers, err => {
        if (err) {
          vorpal.log(chalk.red(err));
        }

        vorpal.log(chalk.green('Transfer complete!'));
        callback();
      });
    });
};

module.exports = setupTransferCommand;