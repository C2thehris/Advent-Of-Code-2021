#include <bits/stdc++.h>

using namespace std;

void part1(vector<string> &lines)
{
  unsigned long long answer = 0;
  vector<int> counts(lines[0].size(), 0);

  for (string s : lines)
  {
    for (int i = 0; i < s.size(); ++i)
    {
      if (s[i] == '1')
      {
        ++counts[i];
      }
    }
  }

  string gamma;

  for (int i : counts)
  {
    if (i >= (lines.size() / 2))
    {
      gamma.push_back('1');
    }
    else
    {
      gamma.push_back('0');
    }
  }

  string eps;

  for (char c : gamma)
  {
    if (c == '1')
    {
      eps.push_back('0');
    }
    else
    {
      eps.push_back('1');
    }
  }

  long long gamma_val = stol(gamma, nullptr, 2);

  long long eps_val = stol(eps, nullptr, 2);

  answer = gamma_val * eps_val;

  cout << "PART 1: " << answer << endl;
}

vector<string> filter_pos(vector<string> &lines, int pos, char c)
{
  vector<string> ret;
  for (string s : lines)
  {
    if (s[pos] == c)
    {
      ret.push_back(s);
    }
  }
  return ret;
}

long long get_pattern(vector<string> lines, char c)
{
  char not_c;
  if (c == '1')
  {
    not_c = '0';
  }
  else
  {
    not_c = '1';
  }

  int len = lines[0].size();
  for (int i = 0; i < len; ++i)
  {
    int count = 0;
    for (string s : lines)
    {
      if (s[i] == '1')
      {
        ++count;
      }
    }

    if (count >= float(lines.size()) / 2.0)
    {
      lines = filter_pos(lines, i, c);
    }
    else
    {
      lines = filter_pos(lines, i, not_c);
    }
    if (lines.size() == 1)
    {
      break;
    }
  }
  return stol(lines[0], nullptr, 2);
}

void part2(vector<string> &lines)
{
  unsigned long long answer = 0;
  long long co2 = get_pattern(lines, '0');
  long long oxy = get_pattern(lines, '1');

  answer = co2 * oxy;

  cout << "PART 2: " << answer << endl;
}

int main(int argc, char const *argv[])
{
  if (argc != 2)
  {
    cerr << "Invalid Usage. Usage: ./[binary] [input]" << endl;
    exit(EXIT_FAILURE);
  }

  string current;
  vector<string> lines;

  ifstream istr(argv[1]);

  while (getline(istr, current))
  {
    if (current == "\n")
      break;
    lines.push_back(current);
  }

  part1(lines);
  part2(lines);

  return EXIT_SUCCESS;
}
