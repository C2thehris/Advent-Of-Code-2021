#include <bits/stdc++.h>

using namespace std;

void part1(vector<string> &lines)
{
  unsigned long long answer = 0;
  vector<int> depths;

  for (auto s : lines)
  {
    depths.push_back(stoi(s));
  }

  int prev = depths[0];
  for (int i = 1; i < depths.size(); ++i)
  {
    if (depths[i] > prev)
    {
      ++answer;
    }
    prev = depths[i];
  }

  cout << "PART 1: " << answer << endl;
}

void part2(vector<string> &lines)
{
  unsigned long long answer = 0;
  vector<int> depths;

  for (auto s : lines)
  {
    depths.push_back(stoi(s));
  }

  int prevsum = depths[0] + depths[1] + depths[2];
  int current;
  for (int i = 3; i < depths.size(); ++i)
  {
    current = depths[i] + depths[i - 1] + depths[i - 2];
    if (current > prevsum)
      ++answer;
    prevsum = current;
  }

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