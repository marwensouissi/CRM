<?php

namespace App\Enums;

enum LeadStatus: string
{
    case NEW = 'NEW';
    case CONTACTED = 'CONTACTED';
    case QUALIFIED = 'QUALIFIED';
    case PROPOSAL = 'PROPOSAL SENT';
    case WON = 'WON';
    case LOST = 'LOST';
}
